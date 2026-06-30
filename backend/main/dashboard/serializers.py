from rest_framework import serializers
from .models import InterviewSession, InterviewQuestion, Answer



VALID_FRAMEWORKS_BY_LANGUAGE = {
    'python': ['django', 'flask', 'fastapi'],
    'javascript': ['react', 'nodejs', 'vue'],
    'java': ['spring_boot', 'jakarta_ee'],
    'rust': ['actix_web', 'axum'],
}


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text', 'score', 'feedback', 'strengths', 'improvements',
                  'time_taken_seconds', 'submitted_at', 'evaluated_at']
        read_only_fields = ['score', 'feedback', 'strengths', 'improvements', 'evaluated_at']


class InterviewQuestionSerializer(serializers.ModelSerializer):
    answer = AnswerSerializer(read_only=True)
    has_answer = serializers.SerializerMethodField()

    class Meta:
        model = InterviewQuestion
        fields = ['id', 'order', 'text', 'topic', 'difficulty',
                  'expected_keywords', 'answer', 'has_answer']

    def get_has_answer(self, obj):
        return hasattr(obj, 'answer')


class InterviewSessionSerializer(serializers.ModelSerializer):

    questions = InterviewQuestionSerializer(many=True, read_only=True)
    questions_answered = serializers.SerializerMethodField()
    topic_breakdown = serializers.SerializerMethodField()

    class Meta:
        model = InterviewSession
        fields = ['id', 'programming', 'frameworks', 'job_field', 'difficulty',
                  'status', 'total_questions', 'overall_score', 'created_at',
                  'completed_at', 'questions', 'questions_answered', 'topic_breakdown']

    def get_questions_answered(self, obj):
        return obj.questions.filter(answer__isnull=False).count()

    def get_topic_breakdown(self, obj):
        breakdown = {}
        for q in obj.questions.filter(answer__isnull=False).select_related('answer'):
            topic = q.get_topic_display()
            breakdown.setdefault(topic, {'total': 0, 'count': 0})
            if q.answer.score is not None:
                breakdown[topic]['total'] += q.answer.score
                breakdown[topic]['count'] += 1
        return {
            topic: round(data['total'] / data['count'], 1) if data['count'] else 0
            for topic, data in breakdown.items()
        }


class InterviewSessionListSerializer(serializers.ModelSerializer):

    questions_answered = serializers.SerializerMethodField()

    class Meta:
        model = InterviewSession
        fields = ['id', 'programming', 'frameworks', 'job_field', 'difficulty',
                  'status', 'overall_score', 'total_questions',
                  'questions_answered', 'created_at']

    def get_questions_answered(self, obj):
        return obj.questions.filter(answer__isnull=False).count()


class CreateSessionSerializer(serializers.Serializer):
 
    programming = serializers.ChoiceField(choices=InterviewSession.PROGRAMMING_CHOICES)
    frameworks = serializers.ListField(
        child=serializers.CharField(max_length=30),
        min_length=1,
        max_length=5,
    )
    job_field = serializers.ChoiceField(choices=InterviewSession.JOB_FIELD_CHOICES)
    difficulty = serializers.ChoiceField(choices=InterviewSession.DIFFICULTY_CHOICES, default='intermediate')
    total_questions = serializers.IntegerField(min_value=5, max_value=15, default=10)

    def validate(self, data):
  
        language = data['programming']
        valid = VALID_FRAMEWORKS_BY_LANGUAGE.get(language, [])
        invalid = [fw for fw in data['frameworks'] if fw not in valid]
        if invalid:
            raise serializers.ValidationError({
                'frameworks': f"{invalid} are not valid frameworks for {language}. "
                               f"Choose from: {valid}"
            })
        return data


class SubmitAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    answer_text = serializers.CharField(min_length=1)
    time_taken_seconds = serializers.IntegerField(required=False, allow_null=True)