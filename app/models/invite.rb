class Invite < ApplicationRecord
  belongs_to :inviter, class_name: "User", foreign_key: "inviter_id"
  belongs_to :invitee, class_name: "User", foreign_key: "invitee_id"
  belongs_to :event

  validates :status, inclusion: { in: %w[pending accepted declined], message: "%{value} is not a valid status" }
  after_initialize :set_default_status, if: :new_record?

  private

  def set_default_status
    self.status ||= "pending"
  end
end
