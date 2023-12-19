class ThemeSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :name

  belongs_to :user
  has_many :posts
end
