class User < ActiveRecord::Base

	has_many :authentications
	has_many :decals

	# Include default devise modules. Others available are:
	# :confirmable, :lockable, :timeoutable and :omniauthable
	devise :database_authenticatable, :registerable, :omniauthable,
        :recoverable, :rememberable, :trackable, :validatable
	
	def apply_omniauth(omni)
		authentications.build(:provider => omni['provider'],
		:uid => omni['uid'],
		:token => omni['credentials'].token,
		:token_secret => omni['credentials'].secret)
	end

	def password_required?
		(authentications.empty? || !password.blank?) && super
	end

end
