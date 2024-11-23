class Event < ApplicationRecord
  belongs_to :host, class_name: "User", foreign_key: "host_id", optional: true

  has_many :rsvps
  has_many :attendees, through: :rsvps, source: :user
  has_many :comments
end
