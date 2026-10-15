--
-- PostgreSQL database dump
--

\restrict KDdg4DmKPdOHxjTS0C7MoRTiWF7Hpostgresql://neondb_owner:npg_ifIGAh9KvN1Y@ep-snowy-wildflower-b40c88z7-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=requireUVcwY6Bn5nk1dCIybpostgresql://neondb_owner:npg_ifIGAh9KvN1Y@ep-snowy-wildflower-b40c88z7-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require59NyuNATGfTbSMGdWU

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_Orders_orderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Orders_orderStatus" AS ENUM (
    'processing',
    'shipped',
    'out_for_delivery',
    'delivered',
    'cancelled'
);


ALTER TYPE public."enum_Orders_orderStatus" OWNER TO postgres;

--
-- Name: enum_Orders_paymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Orders_paymentMethod" AS ENUM (
    'card',
    'cod'
);


ALTER TYPE public."enum_Orders_paymentMethod" OWNER TO postgres;

--
-- Name: enum_Orders_paymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Orders_paymentStatus" AS ENUM (
    'pending',
    'paid',
    'failed'
);


ALTER TYPE public."enum_Orders_paymentStatus" OWNER TO postgres;

--
-- Name: enum_Refunds_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Refunds_status" AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public."enum_Refunds_status" OWNER TO postgres;

--
-- Name: enum_TrackingUpdates_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_TrackingUpdates_status" AS ENUM (
    'processing',
    'shipped',
    'out_for_delivery',
    'delivered',
    'cancelled'
);


ALTER TYPE public."enum_TrackingUpdates_status" OWNER TO postgres;

--
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'buyer',
    'seller',
    'admin'
);


ALTER TYPE public."enum_Users_role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Addresses" (
    id integer NOT NULL,
    "fullName" character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    address1 character varying(255) NOT NULL,
    address2 character varying(255),
    city character varying(255) NOT NULL,
    state character varying(255),
    "zipCode" character varying(255) NOT NULL,
    country character varying(255) DEFAULT 'USA'::character varying,
    "isDefault" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer
);


ALTER TABLE public."Addresses" OWNER TO postgres;

--
-- Name: Addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Addresses_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Addresses_id_seq" OWNER TO postgres;

--
-- Name: Addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Addresses_id_seq" OWNED BY public."Addresses".id;


--
-- Name: CartItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CartItems" (
    id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer,
    "productId" integer
);


ALTER TABLE public."CartItems" OWNER TO postgres;

--
-- Name: CartItems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CartItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CartItems_id_seq" OWNER TO postgres;

--
-- Name: CartItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CartItems_id_seq" OWNED BY public."CartItems".id;


--
-- Name: Categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Categories" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    icon character varying(255),
    slug character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Categories" OWNER TO postgres;

--
-- Name: Categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Categories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Categories_id_seq" OWNER TO postgres;

--
-- Name: Categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Categories_id_seq" OWNED BY public."Categories".id;


--
-- Name: Messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Messages" (
    id integer NOT NULL,
    content text NOT NULL,
    read boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "senderId" integer,
    "receiverId" integer,
    "productId" integer
);


ALTER TABLE public."Messages" OWNER TO postgres;

--
-- Name: Messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Messages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Messages_id_seq" OWNER TO postgres;

--
-- Name: Messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Messages_id_seq" OWNED BY public."Messages".id;


--
-- Name: OrderItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItems" (
    id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    price double precision NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "orderId" integer,
    "productId" integer
);


ALTER TABLE public."OrderItems" OWNER TO postgres;

--
-- Name: OrderItems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."OrderItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OrderItems_id_seq" OWNER TO postgres;

--
-- Name: OrderItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."OrderItems_id_seq" OWNED BY public."OrderItems".id;


--
-- Name: Orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Orders" (
    id integer NOT NULL,
    "totalAmount" double precision NOT NULL,
    "paymentMethod" public."enum_Orders_paymentMethod" NOT NULL,
    "paymentStatus" public."enum_Orders_paymentStatus" DEFAULT 'pending'::public."enum_Orders_paymentStatus",
    "stripeSessionId" character varying(255),
    "orderStatus" public."enum_Orders_orderStatus" DEFAULT 'processing'::public."enum_Orders_orderStatus",
    "shippingFullName" character varying(255) NOT NULL,
    "shippingPhone" character varying(255) NOT NULL,
    "shippingAddress1" character varying(255) NOT NULL,
    "shippingAddress2" character varying(255),
    "shippingZip" character varying(255) NOT NULL,
    "shippingCity" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "buyerId" integer
);


ALTER TABLE public."Orders" OWNER TO postgres;

--
-- Name: Orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Orders_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Orders_id_seq" OWNER TO postgres;

--
-- Name: Orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Orders_id_seq" OWNED BY public."Orders".id;


--
-- Name: PaymentMethods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PaymentMethods" (
    id integer NOT NULL,
    "stripePaymentMethodId" character varying(255) NOT NULL,
    brand character varying(255),
    last4 character varying(255),
    "expMonth" integer,
    "expYear" integer,
    "isDefault" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer
);


ALTER TABLE public."PaymentMethods" OWNER TO postgres;

--
-- Name: PaymentMethods_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PaymentMethods_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PaymentMethods_id_seq" OWNER TO postgres;

--
-- Name: PaymentMethods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PaymentMethods_id_seq" OWNED BY public."PaymentMethods".id;


--
-- Name: Products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Products" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    price double precision NOT NULL,
    "discountPrice" double precision,
    stock integer DEFAULT 0,
    sold integer DEFAULT 0,
    images character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    brand character varying(255),
    "ratingsAverage" double precision DEFAULT '0'::double precision,
    "ratingsCount" integer DEFAULT 0,
    "isFeatured" boolean DEFAULT false,
    "isBestSeller" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "sellerId" integer,
    "categoryId" integer
);


ALTER TABLE public."Products" OWNER TO postgres;

--
-- Name: Products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Products_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Products_id_seq" OWNER TO postgres;

--
-- Name: Products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Products_id_seq" OWNED BY public."Products".id;


--
-- Name: Refunds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Refunds" (
    id integer NOT NULL,
    reason text NOT NULL,
    status public."enum_Refunds_status" DEFAULT 'pending'::public."enum_Refunds_status",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "buyerId" integer,
    "orderId" integer,
    "orderItemId" integer
);


ALTER TABLE public."Refunds" OWNER TO postgres;

--
-- Name: Refunds_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Refunds_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Refunds_id_seq" OWNER TO postgres;

--
-- Name: Refunds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Refunds_id_seq" OWNED BY public."Refunds".id;


--
-- Name: Reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Reviews" (
    id integer NOT NULL,
    rating integer NOT NULL,
    comment text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "productId" integer,
    "userId" integer
);


ALTER TABLE public."Reviews" OWNER TO postgres;

--
-- Name: Reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Reviews_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Reviews_id_seq" OWNER TO postgres;

--
-- Name: Reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Reviews_id_seq" OWNED BY public."Reviews".id;


--
-- Name: TrackingUpdates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TrackingUpdates" (
    id integer NOT NULL,
    status public."enum_TrackingUpdates_status" NOT NULL,
    note character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "orderId" integer
);


ALTER TABLE public."TrackingUpdates" OWNER TO postgres;

--
-- Name: TrackingUpdates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TrackingUpdates_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TrackingUpdates_id_seq" OWNER TO postgres;

--
-- Name: TrackingUpdates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TrackingUpdates_id_seq" OWNED BY public."TrackingUpdates".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    "fullName" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public."enum_Users_role" DEFAULT 'buyer'::public."enum_Users_role",
    phone character varying(255),
    "zipCode" character varying(255),
    address1 character varying(255),
    address2 character varying(255),
    avatar character varying(255),
    "shopName" character varying(255),
    approved boolean DEFAULT true,
    "stripeCustomerId" character varying(255),
    "resetPasswordToken" character varying(255),
    "resetPasswordExpires" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: WishlistItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WishlistItems" (
    id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer,
    "productId" integer
);


ALTER TABLE public."WishlistItems" OWNER TO postgres;

--
-- Name: WishlistItems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."WishlistItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."WishlistItems_id_seq" OWNER TO postgres;

--
-- Name: WishlistItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."WishlistItems_id_seq" OWNED BY public."WishlistItems".id;


--
-- Name: Addresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Addresses" ALTER COLUMN id SET DEFAULT nextval('public."Addresses_id_seq"'::regclass);


--
-- Name: CartItems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItems" ALTER COLUMN id SET DEFAULT nextval('public."CartItems_id_seq"'::regclass);


--
-- Name: Categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories" ALTER COLUMN id SET DEFAULT nextval('public."Categories_id_seq"'::regclass);


--
-- Name: Messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Messages" ALTER COLUMN id SET DEFAULT nextval('public."Messages_id_seq"'::regclass);


--
-- Name: OrderItems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems" ALTER COLUMN id SET DEFAULT nextval('public."OrderItems_id_seq"'::regclass);


--
-- Name: Orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders" ALTER COLUMN id SET DEFAULT nextval('public."Orders_id_seq"'::regclass);


--
-- Name: PaymentMethods id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentMethods" ALTER COLUMN id SET DEFAULT nextval('public."PaymentMethods_id_seq"'::regclass);


--
-- Name: Products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products" ALTER COLUMN id SET DEFAULT nextval('public."Products_id_seq"'::regclass);


--
-- Name: Refunds id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Refunds" ALTER COLUMN id SET DEFAULT nextval('public."Refunds_id_seq"'::regclass);


--
-- Name: Reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reviews" ALTER COLUMN id SET DEFAULT nextval('public."Reviews_id_seq"'::regclass);


--
-- Name: TrackingUpdates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TrackingUpdates" ALTER COLUMN id SET DEFAULT nextval('public."TrackingUpdates_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Name: WishlistItems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WishlistItems" ALTER COLUMN id SET DEFAULT nextval('public."WishlistItems_id_seq"'::regclass);


--
-- Data for Name: Addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Addresses" (id, "fullName", phone, address1, address2, city, state, "zipCode", country, "isDefault", "createdAt", "updatedAt", "userId") FROM stdin;
\.


--
-- Data for Name: CartItems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CartItems" (id, quantity, "createdAt", "updatedAt", "userId", "productId") FROM stdin;
\.


--
-- Data for Name: Categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Categories" (id, name, icon, slug, "createdAt", "updatedAt") FROM stdin;
1	Computers & Laptops	laptop	computers-laptops	2026-10-05 18:40:54.669+05	2026-10-05 18:40:54.669+05
2	Cosmetics & Body Care	cosmetics	cosmetics-body-care	2026-10-05 18:40:54.674+05	2026-10-05 18:40:54.674+05
3	Accessories	accessories	accessories	2026-10-05 18:40:54.675+05	2026-10-05 18:40:54.675+05
4	Clothes	clothes	clothes	2026-10-05 18:40:54.676+05	2026-10-05 18:40:54.676+05
5	Shoes	shoes	shoes	2026-10-05 18:40:54.677+05	2026-10-05 18:40:54.677+05
6	Gifts	gift	gifts	2026-10-05 18:40:54.678+05	2026-10-05 18:40:54.678+05
7	Pet Care	pet	pet-care	2026-10-05 18:40:54.678+05	2026-10-05 18:40:54.678+05
8	Mobile & Tablets	mobile	mobile-tablets	2026-10-05 18:40:54.68+05	2026-10-05 18:40:54.68+05
9	Music & Gaming	gaming	music-gaming	2026-10-05 18:40:54.68+05	2026-10-05 18:40:54.68+05
10	Others	others	others	2026-10-05 18:40:54.681+05	2026-10-05 18:40:54.681+05
\.


--
-- Data for Name: Messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Messages" (id, content, read, "createdAt", "updatedAt", "senderId", "receiverId", "productId") FROM stdin;
\.


--
-- Data for Name: OrderItems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItems" (id, quantity, price, "createdAt", "updatedAt", "orderId", "productId") FROM stdin;
1	1	120	2026-10-05 19:58:04.297+05	2026-10-05 19:58:04.297+05	1	14
2	2	338	2026-10-05 19:58:04.354+05	2026-10-05 19:58:04.354+05	1	15
3	1	253	2026-10-05 20:01:46.365+05	2026-10-05 20:01:46.365+05	2	37
4	1	285	2026-10-05 20:01:46.38+05	2026-10-05 20:01:46.38+05	2	38
5	1	110	2026-10-05 20:02:46.377+05	2026-10-05 20:02:46.377+05	3	39
\.


--
-- Data for Name: Orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Orders" (id, "totalAmount", "paymentMethod", "paymentStatus", "stripeSessionId", "orderStatus", "shippingFullName", "shippingPhone", "shippingAddress1", "shippingAddress2", "shippingZip", "shippingCity", "createdAt", "updatedAt", "buyerId") FROM stdin;
3	110	card	pending	cs_test_a1vEOHcKnS6Rf7VrKKGTB6lli20szOKbWrauM0RrHAeSKPyqQw90PEWsF2	delivered	Demo Buyer	03487922350	P/O Khaas Wadala Sandoan, Tehsil Daska, District Sialkot		51040	Sialkot	2026-10-05 20:02:46.364+05	2026-10-05 20:04:29.34+05	3
2	538	cod	pending	\N	out_for_delivery	Demo Buyer	03487922350	P/O Khaas Wadala Sandoan, Tehsil Daska, District Sialkot		51040	Sialkot	2026-10-05 20:01:46.349+05	2026-10-05 20:04:32.732+05	3
1	796	card	pending	cs_test_b1TyfjAgsRhQqsdkbWeizpVYoZyVwOc0GUIYAlqPVmuC9ssct7tlSSXzjq	shipped	Demo Buyer	03487922350	P/O Khaas Wadala Sandoan, Tehsil Daska, District Sialkot		51040	Sialkot	2026-10-05 19:58:04.263+05	2026-10-05 20:04:45.877+05	3
\.


--
-- Data for Name: PaymentMethods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PaymentMethods" (id, "stripePaymentMethodId", brand, last4, "expMonth", "expYear", "isDefault", "createdAt", "updatedAt", "userId") FROM stdin;
1	pm_1UNDPIGpNLFBVKdQJZauL3zs	visa	4242	4	2038	t	2026-10-05 20:02:25.56+05	2026-10-05 20:02:25.56+05	3
\.


--
-- Data for Name: Products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Products" (id, name, description, price, "discountPrice", stock, sold, images, brand, "ratingsAverage", "ratingsCount", "isFeatured", "isBestSeller", "createdAt", "updatedAt", "sellerId", "categoryId") FROM stdin;
1	Ultra-Slim Laptop 15"	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	81	\N	19	4	{https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop&q=80}	Sony	4.2	8	t	t	2026-10-05 18:40:54.683+05	2026-10-05 18:40:54.683+05	2	1
2	Gaming Desktop PC	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	36	45	26	8	{https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&h=600&fit=crop&q=80}	Apple	3.4	85	f	t	2026-10-05 18:40:54.687+05	2026-10-05 18:40:54.687+05	2	1
3	Wireless Mouse Combo	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	299	\N	22	33	{https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=600&fit=crop&q=80}	Apple	3.2	21	f	f	2026-10-05 18:40:54.689+05	2026-10-05 18:40:54.689+05	2	1
4	27" 4K Monitor	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	262	328	23	22	{https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop&q=80}	Dell	4.3	113	f	f	2026-10-05 18:40:54.69+05	2026-10-05 18:40:54.69+05	2	1
5	Vitamin C Face Serum	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	140	\N	38	14	{https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop&q=80}	Microsoft	4	34	t	t	2026-10-05 18:40:54.693+05	2026-10-05 18:40:54.693+05	2	2
6	Moisturizing Body Lotion	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	139	174	20	27	{https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop&q=80}	HP	4.7	94	t	f	2026-10-05 18:40:54.694+05	2026-10-05 18:40:54.694+05	2	2
7	Matte Lipstick Set	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	189	236	42	28	{https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop&q=80}	Apple	3.4	18	f	f	2026-10-05 18:40:54.696+05	2026-10-05 18:40:54.696+05	2	2
8	Herbal Shampoo	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	284	\N	24	40	{https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&h=600&fit=crop&q=80}	Dell	4.9	67	t	f	2026-10-05 18:40:54.697+05	2026-10-05 18:40:54.697+05	2	2
9	Leather Wallet	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	58	73	17	3	{https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop&q=80}	Microsoft	4.4	96	f	f	2026-10-05 18:40:54.698+05	2026-10-05 18:40:54.698+05	2	3
10	Sunglasses Classic	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	224	280	5	37	{https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop&q=80}	Apple	4	71	t	t	2026-10-05 18:40:54.699+05	2026-10-05 18:40:54.699+05	2	3
11	Analog Wrist Watch	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	186	233	43	2	{https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&h=600&fit=crop&q=80}	Dell	4	34	t	f	2026-10-05 18:40:54.701+05	2026-10-05 18:40:54.701+05	2	3
12	Backpack Travel Pro	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	54	\N	13	35	{https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&q=80}	Samsung	4	61	t	f	2026-10-05 18:40:54.702+05	2026-10-05 18:40:54.702+05	2	3
13	Men's Denim Jacket	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	231	\N	21	26	{https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop&q=80}	Samsung	3.6	93	f	f	2026-10-05 18:40:54.704+05	2026-10-05 18:40:54.704+05	2	4
16	Hooded Sweatshirt	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	217	271	39	33	{https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop&q=80}	LG	5	105	f	f	2026-10-05 18:40:54.71+05	2026-10-05 18:40:54.71+05	2	4
17	Running Sneakers	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	135	\N	17	25	{https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&q=80}	Microsoft	3.7	106	f	f	2026-10-05 18:40:54.711+05	2026-10-05 18:40:54.711+05	2	5
18	Leather Formal Shoes	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	30	38	37	37	{https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&h=600&fit=crop&q=80}	HP	3.9	92	f	f	2026-10-05 18:40:54.713+05	2026-10-05 18:40:54.713+05	2	5
19	Casual Sandals	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	270	338	6	30	{https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&h=600&fit=crop&q=80}	Asus	3.4	110	f	t	2026-10-05 18:40:54.715+05	2026-10-05 18:40:54.715+05	2	5
20	High-Top Sneakers	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	111	139	46	5	{https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=600&fit=crop&q=80}	HP	4.9	28	t	t	2026-10-05 18:40:54.717+05	2026-10-05 18:40:54.717+05	2	5
21	Scented Candle Set	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	280	350	8	38	{/uploads/candle.jpg,/uploads/candle.jpg}	Asus	3.3	65	f	f	2026-10-05 18:40:54.718+05	2026-10-05 18:40:54.718+05	2	6
22	Personalized Photo Frame	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	205	\N	27	5	{/uploads/photo.jpg,/uploads/photo.jpg}	Asus	4.8	21	f	f	2026-10-05 18:40:54.72+05	2026-10-05 18:40:54.72+05	2	6
23	Gift Hamper Deluxe	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	19	24	15	33	{/uploads/gift.jpg,/uploads/gift.jpg}	Microsoft	4.2	16	t	t	2026-10-05 18:40:54.723+05	2026-10-05 18:40:54.723+05	2	6
24	Greeting Card Bundle	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	195	244	3	14	{/uploads/greeting.jpg,/uploads/greeting.jpg}	Samsung	3.8	47	f	f	2026-10-05 18:40:54.724+05	2026-10-05 18:40:54.724+05	2	6
25	Dog Food 5kg	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	166	208	12	37	{https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=600&fit=crop&q=80}	LG	4.6	29	f	f	2026-10-05 18:40:54.726+05	2026-10-05 18:40:54.726+05	2	7
26	Cat Scratching Post	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	52	\N	1	24	{https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=600&h=600&fit=crop&q=80}	Apple	3.1	78	f	f	2026-10-05 18:40:54.728+05	2026-10-05 18:40:54.728+05	2	7
27	Pet Grooming Kit	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	276	345	47	34	{https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop&q=80}	Asus	4.4	89	t	f	2026-10-05 18:40:54.729+05	2026-10-05 18:40:54.729+05	2	7
28	Chew Toy Pack	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	249	311	45	11	{https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=600&h=600&fit=crop&q=80}	Samsung	3.2	77	t	f	2026-10-05 18:40:54.73+05	2026-10-05 18:40:54.73+05	2	7
29	Smartphone 128GB	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	178	223	45	40	{https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop&q=80}	HP	4.6	41	f	t	2026-10-05 18:40:54.731+05	2026-10-05 18:40:54.731+05	2	8
30	Tablet 10.1" WiFi	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	249	311	9	22	{https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop&q=80}	Sony	4.3	101	f	f	2026-10-05 18:40:54.733+05	2026-10-05 18:40:54.733+05	2	8
31	Phone Case Cover	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	62	78	34	12	{https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop&q=80}	Asus	4	23	f	t	2026-10-05 18:40:54.734+05	2026-10-05 18:40:54.734+05	2	8
32	Fast Charger 30W	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	188	235	5	8	{https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop&q=80}	LG	5	40	t	f	2026-10-05 18:40:54.735+05	2026-10-05 18:40:54.735+05	2	8
33	Gaming Headphone Asus with multiple color options	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	210	263	35	35	{https://images.unsplash.com/photo-1599669454699-248893623440?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1599669454699-248893623440?w=600&h=600&fit=crop&q=80}	Sony	4.8	34	f	t	2026-10-05 18:40:54.738+05	2026-10-05 18:40:54.738+05	2	9
34	Bluetooth Speaker	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	228	\N	42	3	{https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop&q=80}	Dell	4.6	111	f	f	2026-10-05 18:40:54.741+05	2026-10-05 18:40:54.741+05	2	9
35	Wireless Gamepad	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	82	103	30	28	{https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&h=600&fit=crop&q=80}	Microsoft	3.7	90	f	t	2026-10-05 18:40:54.743+05	2026-10-05 18:40:54.743+05	2	9
36	Studio Headphones	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	85	106	32	20	{https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop&q=80}	HP	3.8	8	t	f	2026-10-05 18:40:54.745+05	2026-10-05 18:40:54.745+05	2	9
40	Multi-Tool Kit	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	281	351	41	25	{https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&h=600&fit=crop&q=80}	Sony	3.8	99	t	t	2026-10-05 18:40:54.756+05	2026-10-05 18:40:54.756+05	2	10
14	Women's Summer Dress	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	96	120	16	18	{https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop&q=80}	Microsoft	3.6	26	f	t	2026-10-05 18:40:54.705+05	2026-10-05 19:58:04.311+05	2	4
15	Cotton T-Shirt Pack	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	270	338	30	22	{https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80}	Sony	4.6	108	t	t	2026-10-05 18:40:54.707+05	2026-10-05 19:58:04.357+05	2	4
37	LED Desk Lamp	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	253	\N	45	16	{https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop&q=80}	Asus	4	33	f	t	2026-10-05 18:40:54.75+05	2026-10-05 20:01:46.373+05	2	10
38	Ceramic Coffee Mug	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	228	285	40	33	{https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop&q=80}	Apple	3.7	14	t	t	2026-10-05 18:40:54.751+05	2026-10-05 20:01:46.383+05	2	10
39	Travel Water Bottle	Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.	110	\N	15	11	{https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop&q=80,https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop&q=80}	Dell	4.2	84	t	f	2026-10-05 18:40:54.754+05	2026-10-05 20:02:46.388+05	2	10
\.


--
-- Data for Name: Refunds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Refunds" (id, reason, status, "createdAt", "updatedAt", "buyerId", "orderId", "orderItemId") FROM stdin;
\.


--
-- Data for Name: Reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Reviews" (id, rating, comment, "createdAt", "updatedAt", "productId", "userId") FROM stdin;
\.


--
-- Data for Name: TrackingUpdates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TrackingUpdates" (id, status, note, "createdAt", "updatedAt", "orderId") FROM stdin;
1	processing	Order placed	2026-10-05 19:58:04.364+05	2026-10-05 19:58:04.364+05	1
2	processing	Order placed	2026-10-05 20:01:46.388+05	2026-10-05 20:01:46.388+05	2
3	processing	Order placed	2026-10-05 20:02:46.397+05	2026-10-05 20:02:46.397+05	3
4	out_for_delivery	\N	2026-10-05 20:04:25.613+05	2026-10-05 20:04:25.613+05	3
5	delivered	\N	2026-10-05 20:04:29.349+05	2026-10-05 20:04:29.349+05	3
6	out_for_delivery	\N	2026-10-05 20:04:32.737+05	2026-10-05 20:04:32.737+05	2
7	shipped	\N	2026-10-05 20:04:45.886+05	2026-10-05 20:04:45.886+05	1
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, "fullName", email, password, role, phone, "zipCode", address1, address2, avatar, "shopName", approved, "stripeCustomerId", "resetPasswordToken", "resetPasswordExpires", "createdAt", "updatedAt") FROM stdin;
1	Site Admin	admin@shopo.com	$2a$10$vhdL56GZjGgENY17KTvMNe2gd8o9oucWuKceu5Qy7og8CoSUEqBFq	admin	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	2026-10-05 18:40:54.475+05	2026-10-05 18:40:54.475+05
2	Asus Ltd Store	seller@shopo.com	$2a$10$aCDaMQR.XpnUvCYLW9r5zO7kHWYM8es.gioLkx.wfM0QIdQDYNBLG	seller	\N	\N	\N	\N	\N	Asus Ltd	t	\N	\N	\N	2026-10-05 18:40:54.568+05	2026-10-05 18:40:54.568+05
3	Demo Buyer	buyer@shopo.com	$2a$10$oetTT9d2okGoZfH4aUfd7eQV.vdidqd6XzxJiTlgDFk4/amRcAaYy	buyer	\N	\N	\N	\N	\N	\N	t	cus_VNzOUNA7dMqw7Q	\N	\N	2026-10-05 18:40:54.665+05	2026-10-05 20:02:23.191+05
\.


--
-- Data for Name: WishlistItems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WishlistItems" (id, "createdAt", "updatedAt", "userId", "productId") FROM stdin;
\.


--
-- Name: Addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Addresses_id_seq"', 1, false);


--
-- Name: CartItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CartItems_id_seq"', 5, true);


--
-- Name: Categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Categories_id_seq"', 10, true);


--
-- Name: Messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Messages_id_seq"', 1, false);


--
-- Name: OrderItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OrderItems_id_seq"', 5, true);


--
-- Name: Orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Orders_id_seq"', 3, true);


--
-- Name: PaymentMethods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PaymentMethods_id_seq"', 1, true);


--
-- Name: Products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Products_id_seq"', 40, true);


--
-- Name: Refunds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Refunds_id_seq"', 1, false);


--
-- Name: Reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Reviews_id_seq"', 1, false);


--
-- Name: TrackingUpdates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TrackingUpdates_id_seq"', 7, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 3, true);


--
-- Name: WishlistItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."WishlistItems_id_seq"', 1, false);


--
-- Name: Addresses Addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Addresses"
    ADD CONSTRAINT "Addresses_pkey" PRIMARY KEY (id);


--
-- Name: CartItems CartItems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "CartItems_pkey" PRIMARY KEY (id);


--
-- Name: Categories Categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_name_key" UNIQUE (name);


--
-- Name: Categories Categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_pkey" PRIMARY KEY (id);


--
-- Name: Categories Categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_slug_key" UNIQUE (slug);


--
-- Name: Messages Messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_pkey" PRIMARY KEY (id);


--
-- Name: OrderItems OrderItems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "OrderItems_pkey" PRIMARY KEY (id);


--
-- Name: Orders Orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_pkey" PRIMARY KEY (id);


--
-- Name: PaymentMethods PaymentMethods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentMethods"
    ADD CONSTRAINT "PaymentMethods_pkey" PRIMARY KEY (id);


--
-- Name: Products Products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_pkey" PRIMARY KEY (id);


--
-- Name: Refunds Refunds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Refunds"
    ADD CONSTRAINT "Refunds_pkey" PRIMARY KEY (id);


--
-- Name: Reviews Reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "Reviews_pkey" PRIMARY KEY (id);


--
-- Name: TrackingUpdates TrackingUpdates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TrackingUpdates"
    ADD CONSTRAINT "TrackingUpdates_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: WishlistItems WishlistItems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WishlistItems"
    ADD CONSTRAINT "WishlistItems_pkey" PRIMARY KEY (id);


--
-- Name: Addresses Addresses_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Addresses"
    ADD CONSTRAINT "Addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CartItems CartItems_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "CartItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CartItems CartItems_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "CartItems_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Messages Messages_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Messages Messages_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Messages Messages_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrderItems OrderItems_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "OrderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrderItems OrderItems_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "OrderItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Orders Orders_buyerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PaymentMethods PaymentMethods_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentMethods"
    ADD CONSTRAINT "PaymentMethods_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Products Products_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Categories"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Products Products_sellerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Refunds Refunds_buyerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Refunds"
    ADD CONSTRAINT "Refunds_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Refunds Refunds_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Refunds"
    ADD CONSTRAINT "Refunds_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Refunds Refunds_orderItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Refunds"
    ADD CONSTRAINT "Refunds_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES public."OrderItems"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Reviews Reviews_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "Reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Reviews Reviews_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "Reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TrackingUpdates TrackingUpdates_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TrackingUpdates"
    ADD CONSTRAINT "TrackingUpdates_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: WishlistItems WishlistItems_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WishlistItems"
    ADD CONSTRAINT "WishlistItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: WishlistItems WishlistItems_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WishlistItems"
    ADD CONSTRAINT "WishlistItems_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict KDdg4DmKPdOHxjTS0C7MoRTiWF7HUVcwY6Bn5nk1dCIyb59NyuNATGfTbSMGdWU

