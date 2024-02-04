class LocationSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :latitude, :longitude, :address
end
