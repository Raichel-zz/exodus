require File.expand_path('../boot', __FILE__)
require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(:default, Rails.env)

module Genesis
	class Application < Rails::Application
		# Settings in config/environments/* take precedence over those specified here.
		# Application configuration should go into files in config/initializers
		# -- all .rb files in that directory are automatically loaded.

		# Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
		# Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
		# config.time_zone = 'Central Time (US & Canada)'

		# The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
		# config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
		# config.i18n.default_locale = :de

		config.assets.initialize_on_precompile = false

		# Activate observers that should always be running.
		# config.active_record.observers = :user_observer

		# See everything in the log (default is :info)
		config.log_level = :debug

		# Mailer
		config.action_mailer.delivery_method = :smtp
		config.action_mailer.smtp_settings = {
			:address => 'smtpout.secureserver.net',
			:domain  => 'www.chompale.com',
			:port      => 80,
			:user_name => 'admin@chompale.com',
			:password => 'behemot1',
			:authentication => :plain
		}
		
		# To be able to serve decal images from the public folder
		config.serve_static_assets = true

	end
end
