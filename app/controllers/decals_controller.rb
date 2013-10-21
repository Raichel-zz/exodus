class DecalsController < ApplicationController
	# def theme_list
	# @themes = Theme.all
	# respond_to do |format|
	# format.json { render :json => @themes }
	# end
	# end
	def theme_show
		@theme = Theme.find(params[:id])
		return render :json => {:theme => @theme, :backgrounds => @theme.backgrounds }
	end

	def save_img_file
		puts params

		# Get current time stamp
		dateTime = Time.new
		timestamp = dateTime.to_time.to_s
		fileName = "#{timestamp}.jpeg".gsub(' ', '_')

		@user = User.find(params[:userId])
		@user.decals.create(file_name: fileName)

		dir = "#{Rails.root}/public/uploads/#{@user.email}"
		unless File.directory?(dir)
			FileUtils.mkdir_p(dir)
		end

		File.open("#{dir}/#{fileName}", 'wb') do |f|
			f.write(params[:image].read)
		end
		return render :json => {:success => false, :img_url => fileName}
	end

	def make_payment
		#activeMerchant
		# Send requests to the gateway's test servers
		ActiveMerchant::Billing::Base.mode = :test

		# Create a new credit card object
		credit_card = ActiveMerchant::Billing::CreditCard.new(
		:number     => params[:card_number],
		:month      => params[:expiration_month],
		:year       => params[:expiration_year],
		:first_name => params[:first_name],
		:last_name  => params[:last_name],
		:verification_value  => params[:cvc]
		)

		if credit_card.valid?
			# Create a gateway object to the TrustCommerce service
			gateway = ActiveMerchant::Billing::TrustCommerceGateway.new(
                			:login    => 'TestMerchant',
                			:password => 'password'
			         )

			# Authorize for $10 dollars (1000 cents)
			response = gateway.authorize(1000, credit_card)

			if response.success?
			     # Capture the money
			     gateway.capture(1000, response.authorization)
			     render :json => {:success => true}
			else
		         render :json => {:success => true, :errors => [response.message]}
			end
		else 
		    render :json => {:success => true, :errors => credit_card.errors}
		end
	end
end
