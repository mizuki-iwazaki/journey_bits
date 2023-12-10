module Api
  module V1
    class AuthenticationsController < BaseController
      skip_before_action :authenticate

      def create
        @user = login(params[:email], params[:password])

        raise ActiveRecord::RecordNotFound unless @user

        json_string = UserSerializer.new(@user).serialized_json
        set_access_token!(@user)

        render json: json_string
      end
    end
  end
end
