module Api
  module V1
    class PostsController < BaseController
      before_action :set_post, only: %i[show update destroy]
      before_action :check_ownership, only: %i[update destroy]

      def index
        @posts = Post.all
        json_string = PostSerializer.new(@posts, { include: [:user] }).serialized_json
        render json: json_string
      end

      def show
        render :show
      end

      def create
        post = current_user.posts.new(post_params)

        if post.save
          json_string = PostSerializer.new(post).serialized_json
          render json: json_string
        else
          render_400(nil, post.errors.full_messages)
        end
      end

      def update
        if @post.update(post_params)
          json_string = PostSerializer.new(post).serialized_json
          render json: json_string
        else
          render_400(nil, post.errors.full_messages)
        end
      end

      def destroy
        @post.destroy!
        head :no_content
      end

      private
        # Use callbacks to share common setup or constraints between actions.
        def set_post
          @post = Post.find(params[:id])
        end

        # Only allow a list of trusted parameters through.
        def post_params
          params.require(:post).permit(:content, :theme_id, :status)
        end

        def check_ownership
          unless @post.user_id == current_user.id
            render json: { error: 'You are not authorized to perform this action' }, status: :forbidden
          end
        end
    end
  end
end
