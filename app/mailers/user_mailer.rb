class UserMailer < ActionMailer::Base
  default from: 'customer.service@chompale.com'
 
  def welcome_email(user)
    @user = user
    @url  = 'http://www.chompale.com'
    mail(to: @user.email, 
            Bcc: "admin@chompale.com",
            subject: 'Welcome to Chompale')
  end
end