module Api
  module V1
    class MapsController < BaseController
      before_action :check_guest_user, only: %i[index]

      def index
        @posts = current_user.posts.includes(:location).order(created_at: :desc)

        render json: PostSerializer.new(@posts, include: [:location, :user, :theme]).serialized_json
      end
    end
  end
end
