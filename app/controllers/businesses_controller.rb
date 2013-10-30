class BusinessesController < ApplicationController
	
	def list (searchTerm)

        @oauth = Koala::Facebook::OAuth.new(CONFIG['app_id'], CONFIG['secret_key'])
        @token = @oauth.get_app_access_token
        
		@graph = Koala::Facebook::API.new(@token)
		
		result = @graph.search(searchTerm, {:type => 'page', :center => "40.740814,-74.028668", :distance => "10"})
		
		return render :json => result
    end 
end
