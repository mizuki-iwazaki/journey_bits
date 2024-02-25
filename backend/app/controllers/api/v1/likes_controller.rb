module Api
  module V1
    class LikesController < BaseController
      before_action :check_guest_user, only: %i[create destroy]
      before_action :set_post

      def create
        like = @post.likes.new(user_id: current_user.id)
        if like.save
          render json: PostSerializer.new(@post, { params: { current_user_id: current_user.id } }).serialized_json
        else
          render json: like.errors, status: :unprocessable_entity
        end
      end

      def destroy
        like = @post.likes.find_by(user_id: current_user.id)
        if like&.destroy
          render json: PostSerializer.new(@post, { params: { current_user_id: current_user.id } }).serialized_json
        else
          render json: { error: 'Like not found' }, status: :not_found
        end
      end

      private

      def set_post
        @post = Post.find(params[:post_id])
      end
    end
  end
end
