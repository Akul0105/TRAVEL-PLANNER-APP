# Analysis

This chapter analyses the proposed travel recommendation system that identifies product affinities and recommends personalised travel bundles. It covers system requirements, data, the in-house analytical and AI models used, and the tools and technologies selected for implementation. The analysis provides the basis for the design and implementation described in the following chapters.

---

## 1. System Requirements

### 1.1 Functional Requirements

Functional requirements define what the system must do. The following table lists the functional requirements for the travel analytics and recommendation system.

| Requirement Code | Description |
|------------------|-------------|
| FR1 | The system shall allow the user to upload or input historical travel data. |
| FR2 | The system shall preprocess the data by cleaning and formatting it for analysis. |
| FR3 | The system shall identify frequently selected travel items (destinations, activities, restaurants). |
| FR4 | The system shall apply analytics techniques to discover relationships between travel products. |
| FR5 | The system shall generate association rules to identify product affinities. |
| FR6 | The system shall calculate support, confidence, and lift for the generated rules. |
| FR7 | The system shall filter irrelevant association rules based on defined thresholds. |
| FR8 | The system shall recommend travel bundles based on identified product affinities. |
| FR9 | The system shall display recommended bundles in a clear format. |
| FR10 | The system shall allow the user to view analysis results through visualisations or tables. |
| FR11 | The system shall store analysis results for future reference. |
| FR12 | The system shall support the use of analysis results in the recommendation prototype. |

### 1.2 Non-Functional Requirements

Non-functional requirements describe the quality attributes of the system. The table below lists the non-functional requirements.

| Requirement Code | Attribute | Description |
|------------------|-----------|-------------|
| NFR1 | Usability | The system shall be user-friendly and understandable by non-technical users. |
| NFR2 | Presentation | The system shall provide clear and readable visual outputs for analysis results. |
| NFR3 | Performance | The system shall have a fast response time when generating recommendations. |
| NFR4 | Accuracy | The system shall process data accurately to ensure reliable recommendations. |
| NFR5 | Security | The system shall be secure and prevent unauthorised access to data. |
| NFR6 | Reliability | The system shall operate without frequent failures. |
| NFR7 | Scalability | The system shall scale to larger travel datasets in the future. |
| NFR8 | Availability | The system shall be usable without high hardware requirements. |
| NFR9 | Maintainability | The system shall support future enhancements and extensions. |

---

## 2. Problem Statement

Travel agencies often do not use data analytics to understand which travel products are chosen together. The proposed system addresses this by using an in-house affinity model and a conversational preference model to identify product affinities from booking data and to support users via search and a chatbot. The system is designed to recommend personalised travel bundles based on relationships discovered in data rather than on external recommendation APIs.

---

## 3. Proposed Solution Overview

The solution uses **data-driven models developed for this project**: (1) an **affinity model** that discovers relationships between travel products using association rule mining and market basket analysis, and (2) a **conversational preference model** that interprets user input and drives personalised itinerary and bundle suggestions. Both components are implemented and trained within the project rather than relying on third-party recommendation or language APIs.

| Component | Role | Implementation |
|-----------|------|----------------|
| Affinity model | Discovers which destinations, activities, and services are frequently chosen together; outputs rules and bundle suggestions. | Association rule mining (support, confidence, lift) and market basket analysis on transactional booking data. |
| Bundle recommendation engine | Uses affinity rules to rank and suggest travel bundles. | Rule-based scoring and filtering using the affinity model output. |
| Conversational preference model | Understands user intent and extracts travel preferences from natural language. | In-house model trained/fine-tuned for travel-domain dialogue and preference extraction. |
| Search interface | Returns relevant suggestions as the user types. | Integration with catalog and affinity-based ranking. |

---

## 4. Use Case Diagrams

The following diagrams illustrate how administrators and end users interact with the system.

**[Insert diagram: Administrator’s Use Case Diagram]**

*Figure 1: Administrator’s Use Case Diagram*

&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  

**[Insert diagram: End User’s Use Case Diagram]**

*Figure 2: End User’s Use Case Diagram*

&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  

---

## 5. Data Collection

Data collection provides the input needed for training the affinity model and for generating recommendations. The table below summarises the data strategy for this system.

| Aspect | Description |
|--------|-------------|
| Data type | Travel booking transactions: customer preferences, selected destinations, booked activities, and related travel services. |
| Source | Publicly available travel-related datasets supplemented by simulated booking records representing realistic travel scenarios. |
| Suitability | Transactional structure allows identification of co-occurring items and supports product affinity analysis and bundle recommendation. |
| Use in system | Feeds preprocessing pipeline; used to train/evaluate the affinity model and to populate the recommendation engine. |

---

## 6. Data Preparation and Preprocessing

Raw booking data is cleaned and transformed before being used by the affinity model. The table below outlines the main preprocessing steps.

| Step | Action | Purpose |
|------|--------|---------|
| 1 | Remove incomplete and duplicate booking records | Ensure each record represents a genuine transaction. |
| 2 | Standardise travel product names | Single, consistent representation for each product for correct relationship detection. |
| 3 | Transform to transactional format | Represent each booking as a basket of items for co-occurrence analysis. |
| 4 | Review for affinity analysis | Ensure data reflects realistic booking behaviour and supports meaningful product relationships. |

---

## 7. Analytical Techniques and Model Design

### 7.1 Product Affinity Analysis

Product affinity analysis identifies relationships between travel products based on how often they are chosen together in bookings. The following table summarises how this is used in the system.

| Concept | Application in system |
|---------|------------------------|
| Co-occurrence | Analyse which destinations, activities, and services appear in the same booking. |
| Relationship strength | Use support, confidence, and lift to rank and filter rules produced by the affinity model. |
| Bundle design | Use discovered affinities to form travel bundles that reflect actual customer behaviour. |

### 7.2 Association Rule Mining (ARM)

The affinity model uses association rule mining to discover rules of the form *X → Y* and to quantify their strength. The table below defines the metrics used.

| Metric | Definition | Use in system |
|--------|-------------|---------------|
| Support | Frequency of a combination of items in the dataset. | Filter rare combinations; keep rules above a minimum support threshold. |
| Confidence | Likelihood that Y is chosen when X is chosen. | Measure reliability of a rule. |
| Lift | Strength of association compared to independence (value > 1 indicates meaningful association). | Rank rules and prioritise bundle suggestions. |

### 7.3 Market Basket Analysis (MBA)

Each booking is treated as a basket; the system identifies which items are frequently bought together. The table below links MBA to the system.

| MBA concept | System implementation |
|-------------|------------------------|
| Basket | One booking = one basket (set of destinations, activities, accommodations, etc.). |
| Frequent itemsets | Itemsets that meet the minimum support threshold; input for rule generation. |
| Association rules | Output of the affinity model; used by the recommendation engine to suggest bundles. |

### 7.4 Conversational Preference Model

The chatbot is supported by an in-house model that interprets user messages and extracts travel preferences. The table below summarises its role.

| Function | Description |
|----------|-------------|
| Intent recognition | Classifies user intent (e.g. search destinations, get recommendations, plan itinerary). |
| Preference extraction | Extracts destination, dates, budget, activities, and other constraints from natural language. |
| Integration with engine | Passes structured preferences to the bundle recommendation engine to retrieve personalised suggestions. |

---

## 8. Tools and Technologies Analysis

### 8.1 Programming Languages and Runtime

| Technology | Advantages | Disadvantages | Choice rationale |
|------------|------------|----------------|------------------|
| Python | Rich libraries for data and analytics; suitable for ARM and MBA. | Runtime errors possible; not ideal for all platforms. | Used for data preprocessing and affinity model logic. |
| TypeScript / Node.js | Good for scalable backend and API; type safety. | Asynchronous complexity; not for heavy offline computation. | Used for backend services and API layer. |

### 8.2 Data Storage and Backend

| Technology | Advantages | Disadvantages | Choice rationale |
|------------|------------|----------------|------------------|
| PostgreSQL | Reliable; supports complex queries; scalable. | Requires schema design and tuning for very large scale. | Chosen for structured travel and booking data. |
| Supabase | PostgreSQL-based; auth and real-time support. | Vendor dependency. | Used for database and backend services. |

### 8.3 Frontend and Development Environment

| Technology | Advantages | Disadvantages | Choice rationale |
|------------|------------|----------------|------------------|
| React | Component-based; good for dynamic UIs and displaying results. | Requires integration with backend and state management. | Chosen for search UI, catalog, and chatbot interface. |
| Visual Studio Code | Flexible; extensions for TypeScript and data workflows. | Not a dedicated data IDE. | Primary development environment. |

### 8.4 Analytics and Model Environment

| Technology | Advantages | Disadvantages | Choice rationale |
|------------|------------|----------------|------------------|
| Google Colab | Cloud-based; no local install; useful for experimentation. | Limited resources; not for production deployment. | Used for prototyping and testing affinity and preference logic. |
| Excel | Simple data organisation and cleaning. | Limited for large datasets and automated pattern detection. | Used for initial data structuring and inspection. |

### 8.5 Visualisation and Reporting

| Technology | Advantages | Disadvantages | Choice rationale |
|------------|------------|----------------|------------------|
| Microsoft Power BI | Interactive dashboards; clear reporting. | Can slow on very large datasets. | Used to present analysis results and affinity insights. |

---

## 9. Final Tool Selection Summary

| Layer / Purpose | Chosen tool | Justification |
|-----------------|-------------|---------------|
| Data preparation | Excel | Simple organisation, filtering, and cleaning before analysis. |
| Database | PostgreSQL (Supabase) | Reliable storage, complex queries, scalability for travel data. |
| Analytics / reporting | Microsoft Power BI | Clear dashboards and visualisation of affinity and bundle results. |
| Development environment | Visual Studio Code | Flexible development for backend and frontend. |
| Model prototyping | Google Colab | Cloud environment for testing affinity and preference logic. |
| Backend | Node.js | Efficient request handling and API for the web application. |
| Language (backend) | TypeScript | Better structure and error detection in backend code. |
| Frontend | React | Interactive UI for search, catalog, and chatbot. |

---

## 10. Dataset Summary

| Aspect | Description |
|--------|-------------|
| Content | Travel booking transactions: destinations, activities, accommodations, and related services. |
| Structure | Transactional (basket-style) for market basket and association rule analysis. |
| Volume | Sufficient for training and evaluating the affinity model and for demonstrating bundle recommendations. |
| Role | Trains the affinity model; supports validation of association rules and bundle quality. |

---

## 11. Methodology

The development and evaluation of the system follow the phases below. The affinity model and the conversational preference model are trained and integrated within this workflow.

| Phase | Description |
|-------|-------------|
| 1. Scope and objectives | Define system boundaries, functional and non-functional requirements, and success criteria. |
| 2. Data collection and selection | Obtain and select travel booking data suitable for affinity analysis and model training. |
| 3. Data preprocessing | Clean, standardise, and transform data into transactional format for the affinity model. |
| 4. Affinity model design and training | Implement ARM and MBA; train/configure the model (e.g. thresholds, metrics) on preprocessed data. |
| 5. Preference model design and training | Design and train/fine-tune the in-house conversational model for travel intent and preference extraction. |
| 6. Recommendation engine | Build the engine that uses affinity rules and user preferences to generate bundle suggestions. |
| 7. Evaluation | Evaluate rule quality (support, confidence, lift) and recommendation relevance and usability. |
| 8. Integration | Integrate the affinity model, preference model, and engine into the web application (search, catalog, chatbot). |

---

## 12. Discussion

The analysis shows that the system is built around models developed for this project: an affinity model that discovers relationships between travel products using association rule mining and market basket analysis, and a conversational model that interprets user input and extracts travel preferences for personalised recommendations. The main tools and technologies used are:

- **Data preparation:** Excel for organising and cleaning booking data.
- **Database:** PostgreSQL via Supabase for storing travel and booking data.
- **Analytics and reporting:** Microsoft Power BI for visualising affinity results and bundle performance.
- **Backend:** Node.js and TypeScript for the application server and API.
- **Frontend:** React for the user interface (search, catalog, chatbot).
- **Development environment:** Visual Studio Code.
- **Model prototyping:** Google Colab for developing and refining the affinity and conversational models before integration.

Together, these tools and in-house models form a coherent pipeline from raw booking data to bundle suggestions and chatbot-guided trip planning.

---

## 13. Diagram Placeholders

The following spaces are reserved for figures referred to in the Design and Implementation chapters. Insert the corresponding diagrams when finalising the dissertation.

**[Insert: Data flow diagram – from raw data to affinity model and recommendation engine]**

*Figure 3: Data flow for affinity model and recommendation engine*

&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  

**[Insert: System architecture diagram – frontend, backend, models, database]**

*Figure 4: System architecture*

&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  

**[Insert: Sequence diagram – user, chatbot, preference model, recommendation engine]**

*Figure 5: Sequence diagram for chatbot-driven recommendation*

&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  

---

*End of Analysis chapter*
