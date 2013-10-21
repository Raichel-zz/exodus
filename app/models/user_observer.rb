class UserObserver < ActiveRecord::Observer

    observe :user

    def after_validation(model)
        debugger if model.errors.messages.any?
        Rails.logger.error "after validation"
    end
    def before_update(model)
        debugger if !model.valid?
        Rails.logger.error "before update"
    end
    def after_update(model)
        debugger if !model.valid?
        Rails.logger.error "after update"
    end
    def before_save(model)
        debugger if model.errors.messages.any?
        Rails.logger.error "#{model}" 
        Rails.logger.error "before save"
    end
    def after_save(model)
        debugger if model.errors.messages.any?
        Rails.logger.error "after save"
    end
end