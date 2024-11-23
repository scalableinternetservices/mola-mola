class Rsvp < ApplicationRecord
  belongs_to :user
  belongs_to :event

  validates :user_id, uniqueness: { scope: :event_id }

  validates :status, inclusion: { in: %w[accepted declined], message: "%{value} is not a valid status" }
end
