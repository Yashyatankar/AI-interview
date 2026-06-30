from django.db import transaction
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound

from .models import InterviewSession, InterviewQuestion, Answer
from .serializers import (
    InterviewSessionSerializer,
    InterviewSessionListSerializer,
    CreateSessionSerializer,
    SubmitAnswerSerializer,
    AnswerSerializer,
    InterviewQuestionSerializer
)
# Assuming your AI logic file is named gemini_service.py
from .gemini_service import generate_questions, evaluate_answer


class InterviewSessionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling AI Technical Interview Sessions.
    Provides list, retrieve, creation (via generate), and submission endpoints.
    """
    queryset = InterviewSession.objects.all().order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return InterviewSessionListSerializer
        elif self.action == 'create':
            return CreateSessionSerializer
        return InterviewSessionSerializer

    def create(self, request, *kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        try:
            with transaction.atomic():
                # 1. Instantiate the session object (don't commit yet to adapt schema gaps if needed)
                # Mapping fields from CreateSessionSerializer to standard Model structure
                session = InterviewSession.objects.create(
                    programming=validated_data['programming'],
                    frameworks=validated_data['frameworks'],
                    job_field=validated_data['job_field'],
                    difficulty=validated_data['difficulty'],
                    total_questions=validated_data['total_questions'],
                    status='ongoing' # Assuming 'ongoing' or similar default state string
                )

                # Mocking a dynamic session payload structure expected by your Gemini script
                # If your gemini script expects fields like session.job_title, we build a proxy object or mock it:
                class SessionContextProxy:
                    total_questions = session.total_questions
                    job_title = f"{session.get_job_field_display()} Developer"
                    stack = session.get_programming_display()
                    technologies = session.frameworks
                    difficulty = session.difficulty
                    job_description = f"Technical assessment focusing on {', '.join(session.frameworks)}."

                # 2. Call Gemini service to compile JSON questions
                ai_questions_data = generate_questions(SessionContextProxy())

                # 3. Bulk save questions to database
                questions_to_create = [
                    InterviewQuestion(
                        session=session,
                        order=q_data.get('order'),
                        text=q_data.get('text'),
                        topic=q_data.get('topic'),
                        difficulty=q_data.get('difficulty'),
                        expected_keywords=q_data.get('expected_keywords', [])
                    )
                    for q_data in ai_questions_data
                ]
                InterviewQuestion.objects.bulk_create(questions_to_create)

            # Re-serialize full created instance with nested structure for Frontend convenience
            response_serializer = InterviewSessionSerializer(session)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Captures potential JSON decoding errors or Gemini service exceptions gracefully
            return Response(
                {"error": "Failed to generate interview questions. Please try again.", "details": str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )

    @action(detail=True, methods=['post'], url_path='submit-answer')
    def submit_answer(self, request, pk=None):
        """
        POST /api/sessions/{id}/submit-answer/
        Submits an answer text for an active question within the session context, Evaluates via Gemini.
        """
        session = self.get_object()
        
        if session.status == 'completed':
            return Response(
                {"error": "This interview session has already been finalized."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = SubmitAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        q_id = serializer.validated_data['question_id']
        answer_text = serializer.validated_data['answer_text']
        time_taken = serializer.validated_data.get('time_taken_seconds')

        # Verify the target question belongs to this specific interview session
        try:
            question = session.questions.get(id=q_id)
        except InterviewQuestion.DoesNotExist:
            raise NotFound({"error": "Target question not found within this interview session context."})

        # Avoid updating evaluated responses twice
        if hasattr(question, 'answer'):
            return Response(
                {"error": "An answer has already been submitted and assessed for this question."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Call AI evaluation script
            evaluation = evaluate_answer(question, answer_text)
            
            with transaction.atomic():
                # Write assessment results to DB linked directly to the Question
                answer = Answer.objects.create(
                    question=question,
                    text=answer_text,
                    score=evaluation.get('score', 0.0),
                    feedback=evaluation.get('feedback', ''),
                    strengths=evaluation.get('strengths', []),
                    improvements=evaluation.get('improvements', []),
                    time_taken_seconds=time_taken,
                    evaluated_at=timezone.now()
                )
                
                # Check status: check if this was the final question to mark interview complete
                answered_count = session.questions.filter(answer__isnull=False).count()
                if answered_count >= session.total_questions:
                    session.status = 'completed'
                    session.completed_at = timezone.now()
                    
                    # Compute aggregate mathematical overall average score
                    scores = [q.answer.score for q in session.questions.filter(answer__isnull=False) if q.answer.score is not None]
                    if scores:
                        session.overall_score = round(sum(scores) / len(scores), 2)
                    session.save()

            return Response(AnswerSerializer(answer).data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": "AI evaluation failed to compute successfully.", "details": str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )