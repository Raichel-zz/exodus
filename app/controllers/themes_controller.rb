class ThemesController < ApplicationController
	
	def index
		list
		render("list")
	end

	def list
	    @themes = Theme.all
		respond_to do |format|
            format.json { render :json => @themes }
        end
	end

	def show
		@theme = Theme.find(params[:id])
	end

	def new
		@theme = Theme.new
	end

	def create
		@theme = Theme.new(theme_params)
		if @theme.save
			flash[:notice] = "Theme created."
			redirect_to(:action => 'list')
		else
			render('new')
		end
	end

	def edit
		@theme = Theme.find(params[:id])
	end

	def update
		@theme = Theme.find(params[:id])
		if @theme.update_attributes(theme_params)
			flash[:notice] = "Theme updated."
			redirect_to(:action => 'list')
		else
			render('new')
		end
	end

	def delete
		@theme = Theme.find(params[:id])
	end

	def destroy
		@theme = Theme.find(params[:id])
		@theme.destroy
		flash[:notice] = "Theme deleted."
		redirect_to(:action => 'list')
	end

	private

	def theme_params
		params.require(:theme).permit(:name, :file_url)
	end

end
