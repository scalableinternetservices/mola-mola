class Rsvp < ApplicationRecord
  belongs_to :user
  belongs_to :event

  validates :user_id, uniqueness: { scope: :event_id }

  validates :status, inclusion: { in: %w[accepted declined], message: "%{value} is not a valid status" }

  scope :accepted, -> { where(status: 'accepted') }
  scope :declined, -> { where(status: 'declined') }

  def as_json(option = {})
    super(option).except('created_at', 'updated_at')
  end
end
