module Api
  module V1
    class MapsController < BaseController
      def index
        @posts = current_user.posts.includes(:location).order(created_at: :desc)

        render json: PostSerializer.new(@posts, include: [:location, :user, :theme]).serialized_json
      end
    end
  end
end
