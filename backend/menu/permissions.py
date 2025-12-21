from rest_framework import permissions

class IsAdminOrReadOnly(permissions.IsAdminUser):

    def has_permission(self,request,view):
        #GET HEAD OPTIONS
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.is_staff

class IsAuthenticatedOrReadOnlyCreate(permissions.IsAuthenticated):

    def has_permission(self,request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.method == "POST":
            return request.user.is_authenticated
        return False


class IsStaffOrReadOnly(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.method == "POST":
            return request.user.is_staff or request.user.is_superuser
        return False
