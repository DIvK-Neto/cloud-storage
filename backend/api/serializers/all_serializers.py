from .auth.register import UserRegistrationSerializer
from .auth.login import LoginSerializer
from .files.folder import FolderSerializer
from .files.file import FileSerializer
from .files.upload import FileUploadSerializer
from .share.share_serializers import ShareLinkSerializer
from .share.shared_collection_serializers import SharedCollectionSerializer  # <-- ДОБАВЛЕНО
from .comments.guest_comment_serializers import GuestCommentSerializer
from .admin.user_serializers import AdminUserSerializer
from .auth.user_serializers import UserSerializer
