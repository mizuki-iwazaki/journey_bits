module Api
  module V1
    class AuthenticationsController < BaseController
      skip_before_action :authenticate, only: [:create, :guest_login]

      def create
        @user = login(params[:email], params[:password])

        raise ActiveRecord::RecordNotFound unless @user

        json_string = UserSerializer.new(@user).serialized_json
        set_access_token!(@user)

        render json: json_string
      end

      def destroy
        current_user&.deactivate_api_key!
        head :ok
      end

      def guest_login
        # ゲストユーザーの検索または作成
        guest_user = User.find_or_create_by!(email: 'guest@example.com') do |user|
          user.password = SecureRandom.urlsafe_base64
          user.password_confirmation = user.password
          user.name = "ゲストユーザー"
          user.role = :guest
        end

        set_access_token!(guest_user)

        json_string = UserSerializer.new(guest_user).serialized_json
        render json: json_string
      end
    end
  end
end
