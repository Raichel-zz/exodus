class RegistrationsController < Devise::RegistrationsController
    
	def create
		build_resource(sign_up_params)
		if resource.save
		    UserMailer.welcome_email(resource).deliver
			if resource.active_for_authentication?
				set_flash_message :notice, :signed_up if is_navigational_format?
				sign_up(resource_name, resource)
				return render :json => {:success => true, :user => resource}
			else
				set_flash_message :notice, :"signed_up_but_#{resource.inactive_message}" if is_navigational_format?
				expire_session_data_after_sign_in!
				return render :json => {:success => true, :user => resource}
			end
		else
			clean_up_passwords resource
			return render :json => {:success => false, :errors => resource.errors.messages}
		end
	end
end