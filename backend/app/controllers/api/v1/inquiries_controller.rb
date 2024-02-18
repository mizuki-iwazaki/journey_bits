module Api
  module V1
    class InquiriesController < BaseController
      skip_before_action :authenticate, only: %i[create]

      def create
        @inquiry = Inquiry.new(inquiry_params)
        if @inquiry.save
          # 必要に応じてメール送信などの処理を行う
          render json: { status: 'success' }, status: :created
        else
          render json: { errors: @inquiry.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def index
        if current_user.admin?
          @inquiries = Inquiry.all
          render json: @inquiries
        else
          render_404(nil, @user.errors.full_messages)
        end
      end

      private

      def inquiry_params
        params.require(:inquiry).permit(:name, :email, :content)
      end
    end
  end
end
