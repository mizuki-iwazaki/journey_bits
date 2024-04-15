class AnalysisResults < ActiveRecord::Migration[7.1]
  def change
    create_table :analysis_results do |t|
      t.references :post, null: false, foreign_key: true
      t.references :image, null: true, foreign_key: true
      t.json :detected_objects
      t.json :detected_labels
      t.json :recommendations

      t.timestamps
    end
  end
end
