from pyexpat.errors import messages

# from debug_toolbar.store import serialize
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from .models import Post, PostLike
from .serializers import PostSerializer, PostCreateSerializer
from profiles.models import Profile


class PostListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        posts = (
            Post.objects
            .select_related("user__profile")
            .prefetch_related("likes")
            .order_by("-created_at")
        )

        serializer = PostSerializer(
            posts,
            many=True,
            context={"request": request}
        )
        return Response(serializer.data)


class PostDetailPublicView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, post_id):
        post = (
            Post.objects
            .select_related("user__profile")
            .prefetch_related("likes")
            .get(id=post_id)
        )

        serializer = PostSerializer(post, context={"request": request})
        return Response(serializer.data)


class PostCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PostCreateSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            post = serializer.save()

            post = (
                Post.objects
                .select_related("user__profile")
                .prefetch_related("likes")
                .get(id=post.id)
            )

            return Response(
                PostSerializer(post, context={"request": request}).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostUpdateDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, post_id):
        post = get_object_or_404(
            Post.objects.select_related("user__profile"),
            id=post_id,
            user=request.user
        )

        serializer = PostCreateSerializer(
            post,
            data=request.data,
            partial=True,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()

            post = (
                Post.objects
                .select_related("user__profile")
                .prefetch_related("likes")
                .get(id=post.id)
            )

            return Response(
                PostSerializer(post, context={"request": request}).data
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, post_id):
        post = get_object_or_404(Post, id=post_id, user=request.user)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




class MyPostView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        posts = (
            Post.objects
            .filter(user=request.user)
            .select_related("user__profile")
            .prefetch_related("likes")
            .order_by("-created_at")
        )

        serializer = PostSerializer(
            posts,
            many=True,
            context={"request": request}
        )
        return Response(serializer.data)

class UserSpecificPostsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, userId):
        posts = (
            Post.objects
            .filter(user_id=userId)
            .select_related("user__profile")
            .prefetch_related("likes")
            .order_by("-created_at")
        )

        serializer = PostSerializer(
            posts,
            many=True,
            context={"request": request}
        )
        return Response(serializer.data)

        

class ToggleLikeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)

        like, created = PostLike.objects.get_or_create(
            user=request.user,
            post=post
        )

        if not created:
            like.delete()
            return Response(
                {"liked": False},
                status=status.HTTP_200_OK
            )

        return Response(
            {"liked": True},
            status=status.HTTP_201_CREATED
        )

class ToggleFoodToFavourite(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)

        if not post.food:
            return Response(
                {"error": "This post has no labeled food"},
                status=status.HTTP_400_BAD_REQUEST
            )

        profile = get_object_or_404(Profile, user=request.user)

        if profile.favourite_foods.filter(id=post.food.id).exists():
            profile.favourite_foods.remove(post.food)
            return Response(
                {"favourited": False},
                status=status.HTTP_200_OK
            )
        else:
            profile.favourite_foods.add(post.food)
            return Response(
                {"favourited": True},
                status=status.HTTP_200_OK
            )