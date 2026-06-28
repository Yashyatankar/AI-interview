from pathlib import Path
from .views import userDetail


urlpatterns = [
    Path('auth/me', userDetail() )
]
