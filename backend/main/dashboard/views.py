from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userDetail(request):
    
    return Response({
        'name': request.user.get_full_name() or request.user.username,
        'email': request.user.email,
    })