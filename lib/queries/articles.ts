export interface DbArticle {
  id: number;
  number_str: string;
  category: string;
  category_label: string;
  title: string;
  summary: string;
  content: string;
  image_url: string | null;
  read_time: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface DbProtocolStep {
  id: number;
  article_id: number;
  sort_order: number;
  title: string;
  description: string;
}

export interface DbArticleWithSteps extends DbArticle {
  protocol_steps: DbProtocolStep[];
}
