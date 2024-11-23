class Follow < ApplicationRecord
  belongs_to :follower, class_name: "User", foreign_key: "follower_id"
  belongs_to :followee, class_name: "User", foreign_key: "followee_id"
  belongs_to :event

  validates :status, inclusion: { in: %w[pending accepted declined], message: "%{value} is not a valid status" }
  after_initialize :set_default_status, if: :new_record?

  private

  def set_default_status
    self.status ||= "pending"
  end
end
