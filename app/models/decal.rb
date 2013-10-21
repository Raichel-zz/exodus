class Decal < ActiveRecord::Base

	belongs_to :user
	belongs_to :background
	belongs_to :theme

end
