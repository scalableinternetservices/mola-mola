class Event < ApplicationRecord
  belongs_to :host, class_name: "User", foreign_key: "host_id", optional: true

  has_many :rsvps
  has_many :attendees, through: :rsvps, source: :user
  has_many :comments

  def categories_array
    categories.split(";") if categories.present?
  end

  def as_json(options = {})
    super(options).except('updated_at', 'created_at').merge('categories' => categories_array)
  end

  def accepted_users
    attendees.joins(:rsvps).where(rsvps: { status: 'accepted' }).select(:id, :username)
  end

  def declined_users
    attendees.joins(:rsvps).where(rsvps: { status: 'declined' }).select(:id, :username)
  end
end
