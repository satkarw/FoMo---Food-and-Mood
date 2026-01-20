from django.urls import path
from .views import (
    PostListView,
    PostDetailPublicView,
    PostCreateView,
    PostUpdateDeleteView,
    MyPostView,
    ToggleLikeView,
    ToggleFoodToFavourite,
    UserSpecificPostsView,
)

urlpatterns = [
    path("", PostListView.as_view()),

    path("me/", MyPostView.as_view()),
    path("user/<int:userId>/",UserSpecificPostsView.as_view()),

    path("create/", PostCreateView.as_view()),

    path("<int:post_id>/", PostDetailPublicView.as_view()),
    path("<int:post_id>/edit/", PostUpdateDeleteView.as_view()),

    path("<int:post_id>/like/", ToggleLikeView.as_view()),
    path("<int:post_id>/favourite/", ToggleFoodToFavourite.as_view()),
]


