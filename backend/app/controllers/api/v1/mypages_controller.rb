module Api
  module V1
    class MypagesController < BaseController
      before_action :set_user, only: %i[show update]
      before_action :user_params, only: %i[update]
      def show
        render json: UserSerializer.new(@user, include: [:posts, :themes, :locations]).serialized_json
      end

      def update
        if @user.update(user_params)
          render json: UserSerializer.new(@user, include: [:posts, :themes, :locations]).serialized_json
        else
          render_400(nil, @user.errors.full_messages)
        end
      end

      private

      def set_user
        @user = current_user
      end

      def user_params
        params.require(:user).permit(:name, :avatar)
      end
    end
  end
end
