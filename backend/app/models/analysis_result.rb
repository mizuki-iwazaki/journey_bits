require 'net/http'
require 'uri'
require 'json'

class AnalysisResult < ApplicationRecord
  belongs_to :post
  belongs_to :image

  INCLUDED_TYPES = ['tourist_attraction', 'museum', 'park', 'art_gallery']

  def self.recommendations_for(user)
    labels = collect_labels_from_analysis(user)
    search_places_with_labels(labels).uniq { |rec| rec[:place_id] }
  end

  private

  def self.search_places_with_labels(labels)
    api_key = ENV['GOOGLE_MAPS_API_KEY']
    recommendations = []

    labels.each do |label|
      # URI.encode_www_form_componentを使用してラベルをエンコード
      query = URI.encode_www_form_component(label)
      uri = URI("https://maps.googleapis.com/maps/api/place/textsearch/json?query=#{query}&key=#{api_key}&language=ja")

      response = Net::HTTP.get(uri)
      results = JSON.parse(response)['results']

      results.each do |place|
        if (place['types'] & INCLUDED_TYPES).any?
          photo_urls = place['photos']&.take(5)&.map { |photo|
            fetch_photo(photo['photo_reference'])
          }.compact

          recommendations << {
            name: place['name'],
            address: place['formatted_address'],
            latitude: place['geometry']['location']['lat'],
            longitude: place['geometry']['location']['lng'],
            place_id: place['place_id'],
            types: place['types'],
            photo_urls: photo_urls,
            rating: place.dig('rating').to_f,
            user_ratings_total: place.dig('user_ratings_total').to_i
          }
        end
      end
    end

    recommendations.sort_by { |rec| -rec[:rating] }.first(10)
  rescue => e
    puts "Error: #{e}"
    []
  end

  def self.fetch_photo(photo_reference)
    uri = URI("https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=#{photo_reference}&key=#{ENV['GOOGLE_MAPS_API_KEY']}")
    response = Net::HTTP.get_response(uri)
    response.is_a?(Net::HTTPRedirection) ? response['location'] : nil
  end
end
