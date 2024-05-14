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

