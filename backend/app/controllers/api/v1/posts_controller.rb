module Api
  module V1
    class PostsController < BaseController
      before_action :set_post, only: %i[show update destroy]
      before_action :check_ownership, only: %i[show update destroy]

      def index
        @posts = Post.includes(:user, :theme).all
        options = {
        include: [:user, :theme]
        }
        json_string = PostSerializer.new(@posts, options).serialized_json
        render json: json_string
      end

      def show
        render json: PostSerializer.new(@post).serialized_json
      end

      def create
        post = current_user.posts.new(post_params.except(:image_file))

        if post.save
          process_images(post, params[:post][:image_file])
          render json: PostSerializer.new(post).serialized_json
        else
          render_400(nil, post.errors.full_messages)
        end
      end

      def update
        ActiveRecord::Base.transaction do
          if @post.update(post_params.except(:image_file, :remove_image_ids))

            # 画像の削除
            if params[:post][:remove_image_ids].present?
              Image.where(id: params[:post][:remove_image_ids]).destroy_all
            end

            # 新しい画像の追加
            if params[:post][:image_file].present?
              params[:post][:image_file].each do |image_file|
                @post.images.create!(image_file: image_file)
              end
            end
          else
            raise ActiveRecord::Rollback
          end
        end

        if @post.errors.empty?
          render json: PostSerializer.new(@post.reload).serialized_json
        else
          render json: { errors: @post.errors.full_messages }, status: 400
        end
      end

      def destroy
        @post.destroy!
        head :no_content
      end

      private

      def set_post
        @post = Post.find(params[:id])
      end

      def post_params
        params.require(:post).permit(
          :content,
          :theme_id,
          { image_file: [], remove_image_ids: [] },
          { location_attributes: [:name, :latitude, :longitude, :address] },
          :status
        )
      end

      def process_images(post, image_files)
        image_files.each do |image_file|
          post.images.create!(image_file: image_file)
        end if image_files.present?
      end

      def check_ownership
        unless @post.user_id == current_user.id
          render json: { error: 'You are not authorized to perform this action' }, status: :forbidden
        end
      end
    end
  end
end
