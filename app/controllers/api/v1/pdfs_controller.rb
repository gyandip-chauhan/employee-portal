module Api::V1
  class PdfsController < ApplicationController
    before_action :validate_pdf, only: [:merge_pdfs, :add_text, :add_image, :delete_page, :add_annotation, :add_form_field, :add_watermark, :split_pdf, :encrypt_pdf]
    before_action :validate_second_pdf, only: [:merge_pdfs]
    before_action :validate_image, only: [:add_image]
    before_action :validate_params, only: [:add_text, :add_image, :add_annotation, :add_form_field, :add_watermark]

    def add_text
      text, x, y, page, position = extract_text_params
      output_path = Pdf::Master::TextModifier.add_text(@pdf_path, text, x, y, page, position)
      render_pdf_response(output_path, "Text added!")
    end

    def add_image
      x, y, page, position = extract_pdf_params
      output_path = Pdf::Master::ImageModifier.add_image(@pdf_path, @image_path, x, y, page, position)
      render_pdf_response(output_path, "Image added!")
    end

    def delete_page
      page = params[:page].to_i
      return render_error("Invalid page number") if page <= 0

      output_path = Pdf::Master::PageModifier.delete_page(@pdf_path, page)
      render_pdf_response(output_path, "Page deleted!")
    end

    def add_annotation
      annotation, x, y, page, position = extract_annotation_params
      output_path = Pdf::Master::AnnotationModifier.add_annotation(@pdf_path, annotation, x, y, page, position)
      render_pdf_response(output_path, "Annotation added!")
    end

    def add_form_field
      field_name, x, y, page, position = extract_form_params
      output_path = Pdf::Master::FormModifier.add_text_field(@pdf_path, field_name, x, y, page, position)
      render_pdf_response(output_path, "Form field added!")
    end

    def add_watermark
      watermark, x, y, page, position = extract_watermark_params
      output_path = Pdf::Master::WatermarkModifier.add_watermark(@pdf_path, watermark, x, y, page, position)
      render_pdf_response(output_path, "Watermark added!")
    end

    def merge_pdfs
      output_path = Pdf::Master::MergeSplit.merge_pdfs([@pdf_path, @pdf2_path])
      render_pdf_response(output_path, "PDFs merged successfully!")
    end

    def split_pdf
      split_files = Pdf::Master::MergeSplit.split_pdf(@pdf_path)
      render json: { message: "PDF split successfully!", files: split_files.map { |f| pdf_url(f) } }
    end    

    def encrypt_pdf
      password = params[:password]
      return render_error("Password cannot be blank") if password.blank?

      output_path = Pdf::Master::Security.encrypt_pdf(@pdf_path, password)
      render_pdf_response(output_path, "PDF encrypted!")
    end

    private

    # Validates the uploaded PDF file
    def validate_pdf
      file = params[:pdf]
      return render_error("Missing PDF file") unless file
      return render_error("Invalid file type. Only PDFs are allowed.", :unprocessable_entity) unless file.content_type == "application/pdf"
    
      @pdf_path = save_uploaded_file(file, "pdf")
      return render_error("Failed to save uploaded PDF.") unless File.exist?(@pdf_path)
    end    

    # Validates the second PDF file (for merging)
    def validate_second_pdf
      file = params[:pdf2]
      return render_error("Missing second PDF file") unless file
      return render_error("Invalid file type. Only PDFs are allowed.", :unprocessable_entity) unless valid_pdf?(file)

      @pdf2_path = save_uploaded_file(file, "pdf")
    end

    # Validates the uploaded image file
    def validate_image
      file = params[:image]
      return render_error("Missing image file") unless file
      return render_error("Invalid file type. Only PNG or JPEG images are allowed.", :unprocessable_entity) unless valid_image?(file)

      @image_path = save_uploaded_file(file, "png")
    end

    # Validates that numeric params are valid numbers
    def validate_params
      position = params[:position]
      page = params[:page].present? ? params[:page].to_i : 1
    
      # Ensure page is a valid number and greater than 0
      return render_error("Page must be a valid number and greater than 0") if page <= 0
    
      # Ensure x and y are required if position is 'manual'
      if position == "manual"
        return render_error("x coordinate is required") unless params[:x].present?
        return render_error("y coordinate is required") unless params[:y].present?
        return render_error("x must be a valid number") unless valid_number?(params[:x])
        return render_error("y must be a valid number") unless valid_number?(params[:y])
      end
    
      # Check for required parameters based on action
      case action_name
      when "add_text"
        return render_error("Text is required") unless params[:text].present?
      when "add_annotation"
        return render_error("Annotation is required") unless params[:annotation].present?
      when "add_form_field"
        return render_error("Field name is required") unless params[:field_name].present?
      when "add_watermark"
        return render_error("Watermark is required") unless params[:watermark].present?
      end
    end    

    def valid_pdf?(file)
      file.content_type == "application/pdf" && file.size <= 5.megabytes
    end

    def valid_image?(file)
      %w[image/png image/jpeg].include?(file.content_type) && file.size <= 2.megabytes
    end

    def valid_number?(value)
      value.to_i.to_s == value.to_s && value.to_i >= 0
    end

    def extract_text_params
      page = params[:page].to_i
      [params[:text], params[:x].to_i, params[:y].to_i, page, params[:position]]
    end

    def extract_form_params
      page = params[:page].to_i
      [params[:field_name], params[:x].to_i, params[:y].to_i, page, params[:position]]
    end

    def extract_pdf_params
      page = params[:page].to_i
      [params[:x].to_i, params[:y].to_i, page, params[:position]]
    end

    def extract_annotation_params
      page = params[:page].to_i
      [params[:annotation], params[:x].to_i, params[:y].to_i, page, params[:position]]
    end

    def extract_watermark_params
      page = params[:page].to_i
      [params[:watermark], params[:x].to_i, params[:y].to_i, page, params[:position]]
    end

    def render_pdf_response(output_path, success_message)
      if output_path
        render json: { message: success_message, url: pdf_url(output_path) }
      else
        render_error("Invalid operation.", :unprocessable_entity)
      end
    end

    def render_error(message, status = :bad_request)
      render json: { error: message }, status: status
    end

    def save_uploaded_file(file, type)
      temp_file = Tempfile.new(["upload_", ".#{type}"])
      temp_file.binmode
      temp_file.write(file.read)
      temp_file.rewind
      temp_file.path
    end

    def pdf_url(file_path)
      request.base_url + "/uploads/#{File.basename(file_path)}"
    end
  end
end
