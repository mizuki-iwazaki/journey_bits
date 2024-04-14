module Api
  module V1
    class RecommendationsController < BaseController
      def index
        labels = collect_labels_from_user_posts(current_user)
        recommendations = AnalysisResult.search_places_with_labels(labels)

        render json: recommendations
      end

      private

      def collect_labels_from_user_posts(user)
        user.posts.includes(:analysis_results).flat_map do |post|
          post.analysis_results.map(&:detected_labels).flatten
        end.uniq
      end
    end
  end
end
