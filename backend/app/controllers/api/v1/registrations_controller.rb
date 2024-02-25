module Api
  module V1
    class RegistrationsController < BaseController
      skip_before_action :authenticate, only: %i[create]

      def create
        @user = ::User.new(user_params)

        if @user.save
          json_string = UserSerializer.new(@user).serialized_json
          set_access_token!(@user)

          render json: json_string
        else
          render_400(nil, @user.errors.full_messages)
        end
      end

      def update
        @user = current_user
        if params[:user][:remove_avatar] == 'true'
          @user.remove_avatar! if @user.avatar?
        end

        if @user.update(user_params.except(:remove_avatar))
          render json: UserSerializer.new(@user).serialized_json
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation, :avatar, :remove_avatar, :security_question, :security_answer)
      end
    end
  end
end
