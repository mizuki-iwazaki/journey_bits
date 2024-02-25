module Api
  module V1
    class AlbumsController < BaseController
      before_action :check_guest_user, only: %i[index]

      def index
        posts_with_images = current_user.posts.includes(:user, :theme, :location)

        render json: PostSerializer.new(posts_with_images,
                                        include: [:user, :theme, :location],
                                        params: { current_user_id: current_user.id }
                                      ).serialized_json
      end
    end
  end
end
