module Api
  module V1
    class PasswordResetsController < BaseController
      before_action :check_guest_user, only: %i[validate reset]
      skip_before_action :authenticate, only: %i[validate reset]

      def validate
        user = User.find_by(email: params[:email])
        if user && user.authenticate_security_question_and_answer(params[:security_question], params[:security_answer])
          render json: { success: true, user_id: user.id, message: '検証成功' }, status: :ok
        else
          render json: { success: false, error: '情報が一致しません。' }, status: :unprocessable_entity
        end
      end

      def reset
        user = User.find_by(id: params[:user_id])
        if user.nil?
          render json: { success: false, error: 'ユーザーが見つかりません。' }, status: :not_found
          return
        end

        if user.reset_password(params[:password], params[:password_confirmation])
          render json: { success: true, message: 'パスワードがリセットされました。' }, status: :ok
        else
          render json: { success: false, error: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def password_params
        params.require(:user).permit(:password, :password_confirmation)
      end
    end
  end
end
