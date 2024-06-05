# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

roles = [
  'CEO', 'CTO', 'Team Lead', 'Project Manager', 'Sales Head', 'Business Development Manager',
  'Digital Marketing Executive', 'Technical Product Manager', 'Senior System Administrator', 'Software Delivery Manager',
  'HR Manager', 'Senior HR Manager', 'Receptionist', 'HR Executive', 'Senior HR Executive',
  'Software Engineer', 'Junior Software Engineer', 'Senior Software Engineer',
  'QA Engineer', 'Junior QA Engineer', 'Senior QA Engineer',
  'DevOps Engineer', 'Junior DevOps Engineer', 'Senior DevOps Engineer',
  'Data Analyst', 'Junior Data Analyst', 'Senior Data Analyst',
  'Business Analyst', 'Junior Business Analyst', 'Senior Business Analyst',
  'Mobile Engineer', 'Junior Mobile Engineer', 'Senior Mobile Engineer',
  'UI/UX Engineer', 'Junior UI/UX Engineer', 'Senior UI/UX Engineer'
]

roles.each do |role_name|
  Role.find_or_create_by!(name: role_name)
end
puts "Roles are created successfully."

organizations = ['Atharva System', 'Aarav System']
organizations.each do |org_name|
  organization = Organization.find_or_create_by!(name: org_name, 
                                shift_start_time: Time.parse('10:30 AM'),
                                shift_end_time: Time.parse('7:30 PM'))

  departments = [
    'Unassigned', 'HR', 'Sales', 'ROR', 'Mobile', 'Design', 'Magento',
    'Shopify', 'Odoo', 'QA', 'SEO', 'Digital Marketing', '.Net', 'React',
    'Meanstack', 'Management', 'Analytics', 'Information Security', 'SRE',
    'PHP', 'BA'
  ]

  departments.each do |dept_name|
    Department.find_or_create_by!(name: dept_name, organization_id: organization.id)
  end
end
puts "Organizations and Departments are created successfully."

# Eager load roles, departments, and organizations to prevent N+1 queries
all_roles = Role.all.index_by(&:name)
all_departments = Department.includes(:organization).all.group_by { |d| [d.name, d.organization.name] }
all_organizations = Organization.all.index_by(&:name)

# Users
users = [
  {first_name: 'Natvar', last_name: 'Mistry', email: 'ceo@example.com', password: 'password', role: 'CEO', department: 'Management', organization: 'Atharva System'},
  {first_name: 'Dharmdipsinh', last_name: 'Rathod', email: 'cto@example.com', password: 'password', role: 'CTO', department: 'Management', organization: 'Atharva System'},
  {first_name: 'Poonam', last_name: 'Kakkad', email: 'hr@example.com', password: 'password', role: 'HR Manager', department: 'HR', organization: 'Atharva System'},
  {first_name: 'Hardik', last_name: 'Upadhyay', email: 'employee@example.com', password: 'password', role: 'Software Engineer', department: 'ROR', organization: 'Atharva System'},
  # Add more users as needed
]

users.each do |user_data|
  role = all_roles[user_data[:role]]
  department = all_departments[[user_data[:department], user_data[:organization]]]&.first
  organization = all_organizations[user_data[:organization]]

  user = User.find_or_create_by!(email: user_data[:email]) do |u|
    u.first_name = user_data[:first_name]
    u.last_name = user_data[:last_name]
    u.password = user_data[:password]
    u.password_confirmation = user_data[:password]
    u.department = department
    u.organization = organization
  end

  # Assign role using rolify
  user.add_role(role.name)
end
puts "Users are created successfully."
