class Follow < ApplicationRecord
  belongs_to :follower, class_name: "User", foreign_key: "follower_id"
  belongs_to :followee, class_name: "User", foreign_key: "followee_id"

  def as_json(option = {})
    super(option).except('created_at', 'updated_at')
  end
  private

end
