module Api
  module V1
    class BookmarksController < BaseController
      before_action :check_guest_user, only: %i[create destroy]
      before_action :set_post

      def create
        bookmark = @post.bookmarks.new(user_id: current_user.id)
        if bookmark.save
          render json: PostSerializer.new(@post, { params: { current_user_id: current_user.id } }).serialized_json
        else
          render json: bookmark.errors, status: :unprocessable_entity
        end
      end

      def destroy
        bookmark = @post.bookmarks.find_by(user_id: current_user.id)
        if bookmark&.destroy
          render json: PostSerializer.new(@post, { params: { current_user_id: current_user.id } }).serialized_json
        else
          render json: { error: 'Bookmark not found' }, status: :not_found
        end
      end

      private

      def set_post
        @post = Post.find(params[:post_id])
      end
    end
  end
end
