class BackgroundsController < ApplicationController
	def index
		list
		render("list")
	end

	def list
		@backgrounds = Background.all
	end

	def show
		@background = Background.find(params[:id])
	end

	def new
		@background = Background.new
	end

	def create
		@background = Background.new(background_params)
		if @background.save
			flash[:notice] = "Background created."
			redirect_to(:action => 'list')
		else
			render('new')
		end
	end

	def edit
		@background = Background.find(params[:id])
	end

	def update
		@background = Background.find(params[:id])
		if @background.update_attributes(background_params)
			flash[:notice] = "Background updated."
			redirect_to(:action => 'list')
		else
			render('new')
		end
	end

	def delete
		@background = Background.find(params[:id])
	end

	def destroy
		@background = Background.find(params[:id])
		@background.destroy
		flash[:notice] = "Background deleted."
		redirect_to(:action => 'list')
	end

	private

	def background_params
		params.require(:background).permit(:name, :file_url)
	end
end
