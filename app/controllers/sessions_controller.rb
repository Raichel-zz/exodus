class SessionsController < Devise::SessionsController
	def create
	    resource = warden.authenticate!(:scope => resource_name, :recall => "#{controller_path}#failure")
		return sign_in_and_redirect(resource_name, resource)
	end

	def sign_in_and_redirect(resource_or_scope, resource=nil)
		scope = Devise::Mapping.find_scope!(resource_or_scope)
		resource ||= resource_or_scope
		sign_in(scope, resource) unless warden.user(scope) == resource
		return render :json => {:success => true, :auth_token => form_authenticity_token ,:user => resource}
	end

	def failure
		return render :json => {:success => false, :errors => ["Login failed."]}
	end

	# DELETE /users/logout
	def destroy
		#redirect_path = after_sign_out_path_for(resource_name)
		signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
		#set_flash_message :notice, :signed_out if signed_out && is_navigational_format?
        
        return render :json => {:success => true, :auth_token => form_authenticity_token}
        
		# We actually need to hardcode this as Rails default responder doesn't
		# support returning empty response on GET request
		#respond_to do |format|
		#	format.all { head :no_content }
	   	#	format.any(*navigational_formats) { redirect_to redirect_path }
		#end
	end
end