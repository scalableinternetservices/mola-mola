class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :event

  def as_json(option = {})
    super(option).except('created_at', 'updated_at')
  end
end
