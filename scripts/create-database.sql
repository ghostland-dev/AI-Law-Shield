-- Création des tables pour AI Law Shield

-- Table des profils utilisateurs
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  analyses_count INTEGER DEFAULT 0,
  negotiations_count INTEGER DEFAULT 0,
  subscription_id VARCHAR(255),
  subscription_status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des analyses de contrats
CREATE TABLE contract_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  contract_text TEXT NOT NULL,
  analysis_result JSONB NOT NULL,
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('analyzing', 'completed', 'negotiating', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des négociations
CREATE TABLE negotiations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES contract_analyses(id) ON DELETE CASCADE,
  recipient_email VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  email_subject VARCHAR(500) NOT NULL,
  email_content TEXT NOT NULL,
  selected_risks JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'replied', 'accepted', 'rejected')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des templates juridiques
CREATE TABLE legal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  template_text TEXT NOT NULL,
  variables JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_contract_analyses_user_id ON contract_analyses(user_id);
CREATE INDEX idx_contract_analyses_status ON contract_analyses(status);
CREATE INDEX idx_negotiations_analysis_id ON negotiations(analysis_id);
CREATE INDEX idx_negotiations_status ON negotiations(status);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contract_analyses_updated_at BEFORE UPDATE ON contract_analyses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertion de templates de base
INSERT INTO legal_templates (name, category, template_text, variables) VALUES
('NDA Standard', 'confidentiality', 'Les parties s''engagent à maintenir la confidentialité des informations échangées pour une durée de {{duration}} ans, limitée aux informations directement liées au projet {{project_name}}.', '{"duration": "2", "project_name": ""}'),
('Clause IP Équilibrée', 'intellectual_property', 'Le prestataire accorde au client une licence non-exclusive d''utilisation des créations réalisées. Les droits moraux et la propriété des méthodes génériques restent acquis au prestataire.', '{}'),
('Délais de Paiement', 'payment', 'Le règlement interviendra dans un délai maximum de {{payment_days}} jours suivant réception de la facture, avec application d''une pénalité de {{penalty_rate}}% par jour de retard.', '{"payment_days": "30", "penalty_rate": "0.1"}');
