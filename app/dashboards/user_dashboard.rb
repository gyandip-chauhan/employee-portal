require "administrate/base_dashboard"

class UserDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    id: Field::Number,
    attendance_logs: Field::HasMany,
    attendances: Field::HasMany,
    current_sign_in_at: Field::DateTime,
    current_sign_in_ip: Field::String,
    date_of_birth: Field::Date,
    department: Field::BelongsTo,
    discarded_at: Field::DateTime,
    email: Field::String,
    first_name: Field::String,
    last_name: Field::String,
    last_sign_in_at: Field::DateTime,
    last_sign_in_ip: Field::String,
    messages: Field::HasMany,
    organization: Field::BelongsTo,
    password: Field::String,
    password_confirmation: Field::String,
    personal_email: Field::String,
    phone: Field::String,
    roles: Field::HasMany,
    sign_in_count: Field::Number,
    team_memberships: Field::HasMany,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = %i[
    id
    attendance_logs
    attendances
    current_sign_in_at
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = %i[
    id
    attendance_logs
    attendances
    current_sign_in_at
    current_sign_in_ip
    date_of_birth
    department
    discarded_at
    email
    first_name
    last_name
    last_sign_in_at
    last_sign_in_ip
    messages
    organization
    personal_email
    phone
    roles
    sign_in_count
    team_memberships
    created_at
    updated_at
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = %i[
    attendance_logs
    attendances
    current_sign_in_at
    current_sign_in_ip
    date_of_birth
    department
    discarded_at
    email
    first_name
    last_name
    last_sign_in_at
    last_sign_in_ip
    messages
    organization
    password
    password_confirmation
    personal_email
    phone
    roles
    sign_in_count
    team_memberships
  ].freeze

  # COLLECTION_FILTERS
  # a hash that defines filters that can be used while searching via the search
  # field of the dashboard.
  #
  # For example to add an option to search for open resources by typing "open:"
  # in the search field:
  #
  #   COLLECTION_FILTERS = {
  #     open: ->(resources) { resources.where(open: true) }
  #   }.freeze
  COLLECTION_FILTERS = {}.freeze

  # Overwrite this method to customize how users are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(user)
  #   "User ##{user.id}"
  # end
end
