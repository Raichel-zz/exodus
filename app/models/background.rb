class Background < ActiveRecord::Base

	has_many :decals
	has_and_belongs_to_many :themes

end
